import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  // Filter Image Endpoint
  // Display the filtered image
  app.get("/filteredimage", async (req, res) => {
    const imageUrl = req.query.image_url;
    if (!imageUrl) return res.status(404).send("Image is required");

    try {
      // use helper method to get filtered image file
      const filteredImage = await filterImageFromURL(imageUrl);
      // res.json({ filteredImage })
      res.status(200).sendFile(filteredImage, async () => {
        // use helper method to delete the file after using it
        await deleteLocalFiles([filteredImage]);
      });
    } catch (error) {
      res.status(422).send("Error while processing the input image");
    }

  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
