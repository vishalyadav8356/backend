const express = require("express")
const noteModel = require("./model/notes.model")
const cors = require("cors")
const path = require("path")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("./public"))


//post 
app.post('/notes', async (req, res)=>{
    const {title , description} = req.body

    const note = await noteModel.create({
     title, description
    })

    res.status(201).json({
        message: "note created successfully",
        note
    })
})

//get
app.get('/notes', async (req,res)=>{
    const note = await noteModel.find()

    res.status(200).json({
        message:"note fetch successfully",
        note
    })
})

//delete
app.delete('/notes/:id', async (req,res)=>{
    const id = req.params.id
    const note = await noteModel.findByIdAndDelete(id)

    res.status(200).json({
        message:"note deleted successfully"
    }) 
})

//patch

app.patch('/notes/:id', async (req,res)=>{
    const id = req.params.id
    const {title,description} = req.body

   await noteModel.findByIdAndUpdate(id, {title,description}, { new: true })

   res.status(200).json({
    message: "note updated successfully"
   })
})


//wildcard rotue

app.use('*name', (req,res)=>{
     res.sendFile(path.join(__dirname, "..", "/public/index.html"))
})

module.exports = app