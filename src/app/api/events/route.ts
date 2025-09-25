import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import Category from "@/models/Category";
import City from "@/models/City";
import Location from "@/models/Location";

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find({})
      .populate("category")
      .populate("city")
      .populate({ path: "location", populate: { path: "city" } });

    return Response.json(events);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // find or create referenced docs
    const category = await Category.findOneAndUpdate(
      { name: body.category },
      { name: body.category },
      { upsert: true, new: true }
    );

    const city = await City.findOneAndUpdate(
      { name: body.city },
      { name: body.city },
      { upsert: true, new: true }
    );

    const location = await Location.findOneAndUpdate(
      { name: body.location, city: city._id },
      { name: body.location, city: city._id },
      { upsert: true, new: true }
    );

    const event = await Event.create({
      title: body.title,
      description: body.description,
      date: body.date,
      image: body.image,
      category: category._id,
      city: city._id,
      location: location._id,
    });

    return Response.json(event);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
