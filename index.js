const express= require("express");
const fs = require('fs');
const path = require('path');
const app = express();

//MongoDB connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "YOUR MONGO DB ADDRESS"; //Your mongoDB connection address need to be here.

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



app.set("view engine", "ejs");
app.use(express.static("public"));

//textfile
app.get('/about', (req, res) => {
    const aboutTextPath = path.join(__dirname, 'public', 'aboutfamagusta.txt'); 

    fs.readFile(aboutTextPath, 'utf8', (err, data) => {
        if (err) {

            console.error('Error reading file:', err);
            return res.status(500).send('Unable to read about text.');
        }
        
        res.render('about', { aboutText: data });
    });
});


// routes
app.get("/", function(req,res){
    res.render("index");
});

app.get("/touristic", function(req,res){
    res.render("touristic");
});



app.get("/transport", function(req,res){
    res.render("transport");
});

app.get("/news", function(req,res){
    res.render("news");
});

app.get("/map", function(req,res){
    res.render("map");
});

app.get("/faq", function(req,res){
    res.render("faq");
});

app.get("/contact", function(req,res){
    res.render("contact");
});

app.get("/about", function(req,res){
    res.render("about");
});


app.get("/board", function(req,res){
    res.render("board");
});

app.get("/workers", function(req,res){
    res.render("workers")
})


//database bağlantısı gerekli olan routeslar
const mongoose = require('mongoose');
const MessageModel = require('./models/message_mayor'); 
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // Form verilerini ayrıştırmak için

// Mongoose ile MongoDB bağlantısı
mongoose.connect('mongodb+srv://furkanalcikaya1907:HkV8umZIZFXeMGV2@gmbdata.4dvl3cw.mongodb.net/?retryWrites=true&w=majority&appName=gmbdata', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Connection error", err));

//message to mayor kısmı ve routesi
app.get("/message_mayor", function(req, res){
    res.render("message_mayor");
});

// Form verilerinin işlendiği sayfa için POST isteği
app.post('/send-message', async (req, res) => {
    try {
      const { name, email, message } = req.body;
  
      // Veri var mı diye kontrol et
      if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const newMessage = new MessageModel({ name, email, message });
      await newMessage.save();
      res.json({ message: "Message sent successfully!" });
    } catch (error) {
      console.error("Error while saving message:", error);
      res.status(500).json({
        message: "There was an error sending the message.",
        error: error.message // Burada detaylı hata mesajını da gönderebilirsiniz.
      });
    }
  });

//mesajları silmek için bir route
app.delete('/delete-message/:id', async (req, res) => {
  try {
    await MessageModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting message", error: error.message });
  }
});

//mesajları mayorun görmesi için route
app.get("/mayorpage", async (req, res) => {
  try {
    const messages = await MessageModel.find({});
    res.render("mayorpage", { messages: messages });
  } catch (error) {
    res.status(500).send("Error retrieving messages");
  }
});

app.post('/add-news', async (req, res) => {
  try {
    const { category, title, content } = req.body;
    const newsItem = new News({ category, title, content });
    await newsItem.save();
    res.redirect('/newsworkerpage');
  } catch (error) {
    console.error("Error while adding news:", error);
    res.status(500).send("Error adding news.");
  }
});

const News = require('./models/news'); 
const Bills = require("./models/billworker");

//news worker page için route
// GET route for news listing
app.get('/newsworkerpage', async (req, res) => {
  try {
      const news = await News.find({});
      res.render('newsworkerpage', { news: news });
  } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).send("Error fetching news.");
  }
});

// DELETE route for deleting news
app.post('/delete-news/:id', async (req, res) => {
  try {
      await News.findByIdAndDelete(req.params.id); // findByIdAndDelete metodunu kullan
      res.redirect('/newsworkerpage');
  } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).send("Error deleting news.");
  }
});

//news içindeki events için
app.get('/news/events', async (req, res) => {
  try {
      const eventsNews = await News.find({ category: 'events' });
      res.render('events', { news: eventsNews });
  } catch (error) {
      console.error("Error fetching events news:", error);
      res.status(500).send("Error fetching events news.");
  }
});

//roads içindeki events için
app.get('/news/roads', async (req, res) => {
  try {
      const eventsNews = await News.find({ category: 'road' });
      res.render('roads', { news: eventsNews });
  } catch (error) {
      console.error("Error fetching events news:", error);
      res.status(500).send("Error fetching events news.");
  }
});

//news içindeki events için
app.get('/news/announcements', async (req, res) => {
  try {
      const eventsNews = await News.find({ category: 'announcements' });
      res.render('announcements', { news: eventsNews });
  } catch (error) {
      console.error("Error fetching events news:", error);
      res.status(500).send("Error fetching events news.");
  }
});

app.post('/add-bill', async (req, res) => {
  try {
    const { bill_id, fee } = req.body;

    // Veri var mı diye kontrol et
    if (!bill_id || !fee ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newBill = new Bills({ bill_id , fee });
    await newBill.save();
    res.json({ message: "Bill is successfully added!" });
  } catch (error) {
    console.error("Error while saving bill:", error);
    res.status(500).json({
      message: "There was an error adding the bill.",
      error: error.message // Burada detaylı hata mesajını da gönderebilirsiniz.
    });
  }
});
app.get('/billworkerpage', async (req, res) => {
  try {
      const bills = await Bills.find({}); 
      res.render('billworkerpage', { Bills: bills });
  } catch (error) {
      console.error("Error fetching bills:", error);
      res.status(500).send("Error fetching bills.");
  }
});

app.post('/delete-bills/:id', async (req, res) => {
  try {
      await Bills.findByIdAndDelete(req.params.id); // findByIdAndDelete metodunu kullan
      res.redirect('/billworkerpage');
  } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).send("Error deleting news.");
  }
});


app.post('/query-bill', async (req, res) => {
  const { bill_id } = req.body;
  try {
      const bill = await Bills.findOne({ bill_id: Number(bill_id) });
      if (!bill) {
          // Hata mesajıyla birlikte 'bill' null olarak gönderiliyor
          res.render('payment', { bill: null, error: 'Bill is not found.' });
      } else {
          // Fatura bulunduysa, bilgileri ile 'payment.ejs' render ediliyor
          res.render('payment', { bill: bill });
      }
  } catch (error) {
      console.error("Error fetching bill:", error);
      res.status(500).render('payment', { bill: null, error: 'Server error.' });
  }
});

app.get('/payment', (req, res) => {
  res.render('payment', { bill: {} });  
});

app.delete('/delete-bills/:id', async (req, res) => {
  try {
      await Bills.deleteOne({ _id: req.params.id });
      res.json({ message: "Fatura başarıyla silindi." }); // JSON cevabı döndür
  } catch (error) {
      console.error("Error deleting bill:", error);
      res.status(500).json({ error: "Fatura silinirken bir hata oluştu." });
  }
});


//hata için, routesler bundan önce yazılmalı
app.use(function(req, res, next) {
    res.status(404).render("404");
  });

app.listen(3000, () => {
    console.log("listening port 3000");
});