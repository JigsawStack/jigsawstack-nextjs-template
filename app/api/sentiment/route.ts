import { jigsawServer } from "@/lib/JJS";

const POST = async (request: Request) => {
  try {
    const { text } = await request.json();

    if (!text) {
      throw new Error("Missing params");
    }

    const result = await jigsawServer.sentiment({
      text,
    });

    return Response.json({
      ...result,
    });
  } catch (e: any) {
    return Response.json({ error: e?.message || "Unable to complete request" }, { status: 400 });
  }
};

export { POST };
