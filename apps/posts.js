import { ObjectId } from "mongodb";
import { Router } from "express";
import { db } from "../utils/db.js";

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  try {
    const title = req.query.title;
    const category = req.query.category;

    const query = {}; // {title : mongkey  , category : animal}

    if (title) {
      query.title = new RegExp(title, "i"); //เช็คว่าถ้ามี title ใน req ให้เอาไปเพิ่มใน query
    }

    if (category) {
      query.category = new RegExp(category, "i"); //เช็คว่าถ้ามี category ใน req ให้เอาไปเพิ่มใน query
    }
    const collection = db.collection("skillCheckPoint");
    const allposts = await collection.find(query).limit(10).toArray();

    return res.json({ data: allposts });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

postRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("skillCheckPoint");
    const postId = new ObjectId(req.params.id);

    const postById = await collection.findOne({ _id: postId });

    return res.json({ data: postById });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

postRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("skillCheckPoint");
    const postData = { ...req.body, create_at: new Date() };
    const newPostData = await collection.insertOne(postData);
    return res.json({
      message: ` Post Id (${newPostData.insertedId}) has been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

postRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("skillCheckPoint");
    const newPostData = { ...req.body, update_at: new Date() };

    const postId = new ObjectId(req.params.id);

    await collection.updateOne(
      {
        _id: postId,
      },
      {
        $set: newPostData,
      }
    );
    return res.json({
      message: `Post id(${req.params.id}) has been updated successfully`,
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

postRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("skillCheckPoint");
    const postId = new ObjectId(req.params.id);

    await collection.deleteOne({ _id: postId });

    return res.json({
      message: `Post Id(${req.params.id}) has been deleted successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});
export default postRouter;
