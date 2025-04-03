"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JigsawType } from "@/lib/JJS";
import ky from "ky";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const SentimentExample: React.FC = () => {
  const { toast } = useToast();
  const [text, setText] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<Awaited<ReturnType<JigsawType["translate"]>>>();

  const onInputChange = (text: string) => {
    setText(text);
  };

  const onSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const cleanText = text?.trim();

      if (!cleanText) {
        throw new Error("Text is required");
      }

      const result = await ky
        .post<any>("/api/sentiment", {
          json: {
            text: cleanText,
          },
          timeout: 30000,
        })
        .json();

      setResult(result);
    } catch (e: any) {
      const errorJson = await e.response.json();
      console.log("error", errorJson);
      toast({
        title: "Error",
        description: errorJson.error,
      });
    }

    setLoading(false);
  };

  return (
    <Card className="lg:p-4">
      <CardContent>
        <div className="flex flex-col">
          <p className="mt-2 pb-1 text-sm font-medium">Text to analyze</p>
          <Textarea
            placeholder={"Hello, how are you?"}
            onChange={(e) => {
              onInputChange(e.target.value);
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={!text || loading} onClick={onSubmit}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Loading..." : "Submit"}
        </Button>
      </CardFooter>

      {result && (
        <CardContent>
          <p className="pb-1 text-sm font-medium">Results</p>
          <pre className="text-xs whitespace-pre-wrap max-h-[300px] overflow-y-scroll">{JSON.stringify(result, null, 2)}</pre>
        </CardContent>
      )}
    </Card>
  );
};

export default memo(SentimentExample);
