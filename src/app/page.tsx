import { SmartTextarea } from "@/components/smart/smart-textarea";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Textarea className="w-96 h-32" placeholder="Type something here..." />
      <SmartTextarea
        className="w-96 h-32"
        placeholder="Type something here..."
      />
    </main>
  );
}
