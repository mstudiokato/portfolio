import { Container, Section } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { AI_WORKFLOW_PARAGRAPH } from "@/lib/site-content";

/**
 * AI-AUGMENTED WORKFLOW (sek. 8.5). Jeden mocny akapit, wyróżniony tłem
 * (surface), bez przesady. Zaufanie, nie hype.
 */
export function AiWorkflow() {
  return (
    <Section tone="section">
      <Container>
        <div className="bg-surface border-border rounded-card border p-8 sm:p-12">
          <Label>AI-Augmented Workflow</Label>
          <p className="text-ink text-h4 mt-6 max-w-3xl leading-relaxed font-normal">
            {AI_WORKFLOW_PARAGRAPH}
          </p>
        </div>
      </Container>
    </Section>
  );
}
