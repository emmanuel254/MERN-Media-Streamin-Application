import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'

import Template from './../template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import mediaRoutes from './routes/media.routes'
import galleryRoutes from './routes/gallery.routes'
import chatRoutes from './routes/chats.routes'
//comment out before building for production
import devBundle from './devBundle'

// Modules for server side rendering
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import MainRouter from './../client/MainRouter'
import { StaticRouter } from "react-router-dom";

import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
import theme from './../client/theme'

// For SSR with Data
import { matchRoutes } from 'react-router-config'
import routes from './../client/routeConfig'
import 'isomorphic-fetch'
// End

const CURRENT_WORKING_DIR = process.cwd()

const app = express()

//comment out before building for production
devBundle.compile(app)

/**
 * If a matching route is found, then any associated loadData method will be executed 
 * to return a Promise containing the fetched data or null if there were no loadData methods.
 * *****FOR SSR WITH DATA
 */
const loadBranchData = (location) => {
  const branch = matchRoutes(routes, location)
  const promises = branch.map(({route, match}) => {
    return route.loadData
      ? route.loadData(branch[0].match.params)
      : Promise.resolve(null)
  })
  return Promise.all(promises)
}

  /*... configure express ... */
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(compress())
  // secure apps by setting various HTTP headers
  app.use(helmet())
  // enable CORS - Cross Origin Resource Sharing
  app.use(cors())

  app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

  // Main Routes
  app.use('/', userRoutes)
  app.use('/',authRoutes)
  app.use('/', mediaRoutes)
  app.use('/', galleryRoutes)
  app.use("/", chatRoutes);

  app.get('*', (req,res) => {
    const sheets = new ServerStyleSheets()
    const context = {}
    
    loadBranchData(req.url).then(data => {
      const markup = ReactDOMServer.renderToString(
        sheets.collect( 
          <StaticRouter location={req.url} context={context}>
            <ThemeProvider theme={theme}>
              <MainRouter  data={data}/>
            </ThemeProvider>
          </StaticRouter>
        )
      )
      if(context.url){
        return res.redirect(303, context.url)
      }
  
      const css = sheets.toString()
      res.status(200).send(Template({
        markup: markup,
        css: css
      }))
    }).catch(err => {
      res.status(500).send({"error": "Could not load react view with data"})
    })

  })

  // Catch unauthorised errors
  app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error" : err.name + ": " + err.message})
        }else if (err) {
        res.status(400).json({"error" : err.name + ": " + err.message})
        console.log(err)
        }
    })

export default app