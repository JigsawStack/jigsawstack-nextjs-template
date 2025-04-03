import { jigsawServer } from "@/lib/JJS";

const POST = async (request: Request) => {
  try {
    const { fields, file_store_key } = await request.json();

    if (!fields || !file_store_key) {
      throw new Error("Missing params");
    }

    console.log("fields", fields, "file_store_key", file_store_key);
    const result = await jigsawServer.vision.vocr({
      prompt: fields,
      file_store_key: file_store_key,
    });

    return Response.json({
      ...result,
    });
  } catch (e: any) {
    return Response.json({ error: e?.message || "Unable to complete request" }, { status: 400 });
  }
};

export { POST };
