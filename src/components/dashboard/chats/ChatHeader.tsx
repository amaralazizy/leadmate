type Props = { name: string };

export default async function ChatHeader({ name }: Props) {
  return (
    <header className="border-b p-4">
      <h1 className="font-heading text-lg">{name}</h1>
    </header>
  );
}
