export function HeadingWords({ children }: { children: string }) {
  return (
    <span className="heading-words">
      {children.split(/(\s+)/).filter(Boolean).map((part, index) =>
        /^\s+$/.test(part) ? part : (
          <span className="heading-word-mask" key={index}>
            <span className="heading-word">{part}</span>
          </span>
        ),
      )}
    </span>
  );
}
