import { jigsawServer } from "@/lib/JJS";

const POST = async (request: Request) => {
  try {
    const { text, accent } = await request.json();

    if (!text || !accent) {
      throw new Error("Missing params");
    }

    const result = await jigsawServer.audio.text_to_speech({
      text,
      accent,
    });

    return new Response(await result.buffer(), {
      headers: {
        "Content-Type": "audio/wav",
      },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e?.message || "Unable to complete request" }), {
      status: 400,
    });
  }
};

export { POST };
