import { generateObject } from "ai";
import { FormEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { zerialize } from "zodex";

import { smartFill } from "@/app/actions";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

export interface SmartPasteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  schema: z.ZodObject<any, any>;
}

function SmartPasteButton({ schema, ...props }: SmartPasteButtonProps) {
  const form = useFormContext();
  const [inputData, setInputData] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" {...props}>
          Smart Paste
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Smart Paste</DialogTitle>
          <DialogDescription>
            Paste your data here and we will try to fill the form for you.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            rows={6}
            name="data"
            placeholder="Paste your data here"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            type="button"
            onClick={async () => {
              setLoading(true);
              const object = await smartFill(
                zerialize(schema.partial(), {}),
                inputData
              );

              form.reset();
              for (const key in object) {
                form.setValue(key, object[key]);
              }
              setLoading(false);

              setDialogOpen(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SmartPasteButton;
