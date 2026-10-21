type JsonLdProps = {
  data: Record<string, unknown>;
  id?: string;
};

export default function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(data),
      }}
    />
  );
}
import { serializeJsonLd } from "@/lib/jsonld";
