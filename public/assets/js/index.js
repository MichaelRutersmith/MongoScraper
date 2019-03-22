
//click handler for scraping the news

$(".scrapeNBANewsBtn").on("click", () => {
    $(".loadingDiv").show();
    //do the get for for "/scrape" on clicking button
    $.get("/api/scrape", function (data) {
        //reload page after scrape to show results
        location.reload("/");
        $(".loadingDiv").hide();
    });
})


//click handler for saving article

$(".saveArticleBtn").on("click", function () {
    var id = $(this).attr("data-id");

    $.ajax("/api/saveArticle", {
        type: "PUT",
        data: { id }
    }).then(
        data => {
            if (data === 'ok') {
                bootbox.alert("Your article has been saved.", () => {
                    location.reload("/");
                });
            }
        }
    );
});

//click handler to delete articles
$("#clearArticlesBtn").on("click", function () {
    $.ajax("/api/deleteArticles", {
        type: "DELETE"
    }).then(
        function () {
            location.reload("/");
        }
    );
})
//click handler to add notes
$(".notesBtn").on("click", function () {
    var id = $(this).attr("data-id");
    $.get("/api/articleNotes/" + id,
        function (notes) {
            notes.forEach(note => {
                addNewNote(note, id);
            });
            $("#saveNoteBtn").attr("data-id", id);
            $("#notes-modal").modal("toggle");
        });
})

function addNewNote(note, articleId) {
    var noteDiv = $(`<div data-id="${note._id}" style="margin-bottom:15px !important" class="noteContainer row ">`)
    var noteTextDiv = $('<div class="col-10">');
    var noteDeleteDiv = $('<div class="col-2">');;
    var noteText = $("<p>").text(note.body);
    var noteButton = $(`<button class="btn btn-danger deleteButton" data-article_id="${articleId}" data-id="${note._id}">X</button>`);
    noteTextDiv.append(noteText);
    noteDeleteDiv.append(noteButton);
    noteButton.on("click", function () {
        var id = $(this).attr("data-id");
        var articleId = $(this).attr("data-article_id");
        $.ajax("/api/deleteNote/" + id, {
            data: { articleId },
            type: "DELETE"
        }).then(
            function (deleted) {
                bootbox.alert("Note deleted!", () => {
                    $(`div [data-id="${deleted._id}"]`).remove();
                });
            }
        );
    })
    noteDiv.append(noteTextDiv, noteDeleteDiv);
    $('#savedNotes').prepend(noteDiv);
}
//click handler to save notes
$("#saveNoteBtn").on("click", function () {
    var note = $("#noteText").val();
    var id = $(this).attr("data-id");
    $.ajax("api/saveNote", {
        type: "PUT",
        data: {
            id,
            note
        }
    }).then(
        function (note) {
            if (typeof note === 'object') {
                bootbox.alert("Note saved!", function () {
                    $("#noteText").val('');
                    addNewNote(note, id);
                })
            } else {
                //TODO: Log error here...
            }
        }
    );
})
//delete article from saved articles
$(".deleteFromSaveBtn").on("click", function () {
    var id = $(this).attr("data-id");
    $.ajax("/api/deleteFromSaved", {
        type: "PUT",
        data: { id }
    }).then(
        function (data) {
            if (data === 'ok') {
                bootbox.alert("Article deleted from saved!", () => {
                    location.reload("/saved");
                })
            }
        }
    );
})
//runs when doc is loaded hiding the things i want hidden, showing what i want shown.
$(document).ready(function () {
    $("#myModal").on("show", function () {   
        $("#myModal a.btn").on("click", function (e) {
            console.log("button pressed");   
            $("#myModal").modal('hide');     
        });
    });
    $("#myModal").on("hide", function () {    
        $("#myModal a.btn").off("click");
    });

    $("#myModal").on("hidden", function () {  
        $("#myModal").remove();
    });
});