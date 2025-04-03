"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { memo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { jigsawClient, JigsawType } from "@/lib/JJS";
import ky from "ky";
import { Loader2 } from "lucide-react";

const VOCRExample: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File>();
  const [fields, setFields] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<Awaited<ReturnType<JigsawType["vision"]["vocr"]>>>();

  const onFileChange = (file: File) => {
    try {
      if (!file) {
        throw new Error("No file uploaded");
      }
      setFile(file);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message,
      });
    }
  };

  const onSubmit = async () => {
    if (loading) return;
    setLoading(true);
    let fileKey: string | null = null;
    try {
      if (!file) {
        throw new Error("No file uploaded");
      }

      const fieldsClean = fields?.trim();

      if (!fieldsClean) {
        throw new Error("No fields to extract");
      }

      const fieldsArray = fieldsClean.includes(",") ? fieldsClean.split(",").map((field) => field.trim()) : [fieldsClean.trim()];

      const blob = new Blob([file as any], { type: file.type });

      const fileUploadResult = await jigsawClient.store.upload(blob, {
        filename: file.name,
        overwrite: true,
      });

      fileKey = fileUploadResult.key;

      const result = await ky
        .post<any>("/api/vocr", {
          json: {
            fields: fieldsArray,
            file_store_key: fileKey,
          },
          timeout: 30000,
        })
        .json();

      setResult(result);
    } catch (e: any) {
      const errorJson = e?.response?.json ? await e.response.json() : { error: e?.message };
      console.log("error", errorJson);
      toast({
        title: "Error",
        description: errorJson.error,
      });
    }

    setLoading(false);

    fileKey &&
      (await jigsawClient.store.delete(fileKey).then(() => {
        console.log("delete file completed");
      }));
  };

  return (
    <Card className="lg:p-4">
      <CardContent>
        <div className="flex flex-col">
          <p className="mt-2 pb-1 text-sm font-medium">Image Upload</p>
          {file && <img src={URL.createObjectURL(file)} alt="uploaded image" className="object-contain max-h-[300px] py-2" />}
          <Input
            type={"file"}
            accept={".png,.jpg,.jpeg"}
            max={1}
            onChange={(e) => {
              e.target?.files?.[0] && onFileChange(e.target.files?.[0] as File);
            }}
          />
          <p className="mt-2 pb-1 text-sm font-medium">Fields to extract</p>
          <Input
            type={"text"}
            placeholder={"First name, last name, dob"}
            onChange={(e) => {
              setFields(e.target.value);
            }}
          />
          <p className="pt-0.5 text-xs text-muted-foreground">Separate each field with a comma</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={!file || !fields || loading} onClick={onSubmit}>
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

export default memo(VOCRExample);
