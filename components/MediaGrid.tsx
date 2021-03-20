import Link from "next/link";

type Props = {
  items: {
    id: string;
    contentURI: string;
    name: string;
    description: string;
  }[];
};

export function MediaGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-3 gap-8">
      {items.map((item, idx) => (
        <Link href={`/item/${encodeURIComponent(item.id)}`} key={idx}>
          <a className="block bg-gray-100">
            <figure>
              <img className="block w-full" src={item.contentURI} />
              <figcaption className="font-medium p-4">
                <div className="text-cyan-600">{item.id}</div>
              </figcaption>
            </figure>
          </a>
        </Link>
      ))}
    </div>
  );
}
