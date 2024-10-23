"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JigsawType } from "@/lib/JJS";
import ky from "ky";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import accents from "@/lib/accents.json";
import { Textarea } from "@/components/ui/textarea";

const TTSExample: React.FC = () => {
  const { toast } = useToast();
  const [text, setText] = useState<string>();
  const [accent, setAccent] = useState<string>("en-AU-female-2");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<Blob>();

  const onInputChange = (text: string, type: "text" | "accent") => {
    if (type === "text") {
      setText(text);
    } else {
      setAccent(text);
    }
  };

  const onSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const cleanText = text?.trim();

      if (!cleanText || !accent) {
        throw new Error("Fields are required");
      }

      const result = await ky
        .post<any>("/api/tts", {
          json: {
            text: cleanText,
            accent: accent,
          },
          timeout: 30000,
        })
        .blob();

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
    <Card className="lg:p-4">
      <CardContent>
        <div className="flex flex-col">
          <p className="mt-2 pb-1 text-sm font-medium">Text to Speak</p>
          <Textarea
            placeholder={"Hey, how are you?"}
            onChange={(e) => {
              onInputChange(e.target.value, "text");
            }}
          />
          <p className="mt-2 pb-1 text-sm font-medium">Target Accent</p>
          <Select
            defaultValue={accent}
            onValueChange={(value) => {
              onInputChange(value, "accent");
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={"Language"} />
            </SelectTrigger>
            <SelectContent>
              {accents.map((a) => (
                <SelectItem key={a.accent} value={a.accent}>
                  {a.locale_name}
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
          <audio src={URL.createObjectURL(result)} controls />
        </CardContent>
      )}
    </Card>
  );
};

export default memo(TTSExample);
