import { JigsawStack } from "jigsawstack";
export type JigsawType = ReturnType<typeof JigsawStack>;

const jigsawClient = JigsawStack({
  apiKey: process.env.NEXT_PUBLIC_JIGSAWSTACK_PUBLIC_KEY || "pk_..",
});

const jigsawServer = JigsawStack({
  apiKey: process.env.JIGSAWSTACK_SECRET_KEY || "sk_..",
});

export { jigsawClient, jigsawServer };
