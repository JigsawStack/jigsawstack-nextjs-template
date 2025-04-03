import { jigsawServer } from "@/lib/JJS";

const POST = async (request: Request) => {
  try {
    const { text, target_language } = await request.json();

    if (!text || !target_language) {
      throw new Error("Missing params");
    }

    const result = await jigsawServer.translate({
      text,
      target_language: target_language,
    });

    return Response.json({
      ...result,
    });
  } catch (e: any) {
    return Response.json({ error: e?.message || "Unable to complete request" }, { status: 400 });
  }
};

export { POST };
