//require express
var express = require("express");
//require mongoose
var mongoose = require("mongoose");
// require axios
var axios = require("axios");
// require cheerio
var cheerio = require ("cheerio");
// declare router
var router = express.Router();
// declare db
var db = require("../models");
// boilerplate
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex : true });


// get function for "/"
router.get("/", function (req, res) {
    
    db.article.find({saved:false})
        .then(function(found){            
            res.render("index", {page:"index",articles:found});
        })
        .catch(function(err){
            console.log(err.message);
        })
});

router.get("/api/scrape", function (req,res){
    axios.get("https://www.foxsports.com/nba/news").then(function(response){
        var $ = cheerio.load(response.data);
        $(".has-post-thumbnail")
            .each(function(){
                var imgSource = $(this).find("a").find("img").attr("data-srcset");
                var thumbnail = imgSource.split(".jpg")[0] + ".jpg";
                var result = {
                    title : $(this).children("a").attr("title"),
                    link : $(this).children("a").attr("href"), 
                    thumbnail,
                    saved: false
                };
                db.article.create(result)
                    .then(function(created){
                    })
                    .catch(function(err){
                        console.log(err.message);
                    })     
        });
        res.send("ok");
    });

});

router.get("/saved", function (req, res) {
    db.article.find({saved:true})
        .then(function(found){            
            res.render("saved_articles", {articles:found});
        })
        .catch(function(err){
            console.log(err.message);
        })
});

router.get("/api/articleNotes/:id", function(req, res){
    var id = req.params.id;
    db.article.findOne({_id: id}).populate("notes")
    .then (function(dbArticle){
        res.json(dbArticle.notes);
    })
    .catch(function(err){
        res.json(err);
    });
})

router.put("/api/saveArticle", function(req,res){
    db.article.findOneAndUpdate({_id:req.body.id}, {saved:true}, {new:true}, function(err,updated){
       if(updated) res.send("ok")
       else console.log(err.message); 
    });
});

router.put("/api/saveNote", function(req,res){
    var id = req.body.id;
    var note = req.body.note;
    
    db.Note.create({body:note})
        .then(function(dbNote){
            db.article.findOneAndUpdate({_id:id}, {$push:{notes: dbNote._id}},{new:true}, function(err,updated){
                if(updated){
                    res.json(dbNote);
                } else {
                    res.json(err.message);
                }
            });
        })
        .catch(function(err){
            res.send(err.message);
        })
});

router.put("/api/deleteFromSaved", function(req,res){
    db.article.findOneAndUpdate({_id:req.body.id}, {saved:false}, {new:true}, function(err,updated){
        if(updated) res.send("ok");
        else console.log(err.message);
    })
})



router.delete("/api/deleteNote/:id", function(req,res){
    var articleId = req.body.articleId; 
    db.Note.findByIdAndDelete({_id:req.params.id}, function(err,deleted){
        if(deleted){
            db.Article.updateOne({_id:articleId}, {$pull:{notes:deleted._id}}, function(err,worked){
                if (worked) res.json(deleted);
            })
        } else {
            res.json(err.message);
        }
    })
})

router.delete("/api/deleteArticles", function(req,res){
    db.article.deleteMany({saved:false})
        .then(function(found){
            res.status(200).end(); 
        })
        .catch(function(err){
            res.send(err.message);
        })
});



module.exports = router;