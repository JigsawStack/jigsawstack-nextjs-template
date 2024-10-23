"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JigsawType } from "@/lib/JJS";
import ky from "ky";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import languages from "@/lib/languages.json";
import { Textarea } from "@/components/ui/textarea";

const TranslationExample: React.FC = () => {
  const { toast } = useToast();
  const [text, setText] = useState<string>();
  const [target_language, setTargetLanguage] = useState<string>("fr");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] =
    useState<Awaited<ReturnType<JigsawType["translate"]>>>();

  const onInputChange = (text: string, type: "text" | "target_language") => {
    if (type === "text") {
      setText(text);
    } else {
      setTargetLanguage(text);
    }
  };

  const onSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const cleanText = text?.trim();

      if (!cleanText || !target_language) {
        throw new Error("Fields are required");
      }

      const result = await ky
        .post<any>("/api/translate", {
          json: {
            text: cleanText,
            target_language: target_language,
          },
          timeout: 30000,
        })
        .json();

      setResult(result);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message,
      });
    }

    setLoading(false);
  };

  return (
    <Card className="p-4">
      <CardContent>
        <div className="flex flex-col">
          <p className="mt-2 pb-1 text-sm font-medium">Text to translate</p>
          <Textarea
            placeholder={"Hello, how are you?"}
            onChange={(e) => {
              onInputChange(e.target.value, "text");
            }}
          />
          <p className="mt-2 pb-1 text-sm font-medium">Target language</p>
          <Select
            defaultValue={target_language}
            onValueChange={(value) => {
              onInputChange(value, "target_language");
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={"Language"} />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <pre className="text-xs whitespace-pre-wrap max-h-[300px] overflow-y-scroll">
            {JSON.stringify(result, null, 2)}
          </pre>
        </CardContent>
      )}
    </Card>
  );
};

export default memo(TranslationExample);
