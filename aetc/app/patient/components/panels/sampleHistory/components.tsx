// LabelValue.tsx
export const LabelValue = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <span>
      <strong>{label}:</strong> {value}
    </span>
  );
};

export const ListWithLabelValue = ({
  title,
  list,
}: {
  title: string;
  list: { label: string; value: string }[][];
}) => {
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {list.map((group, index) => (
          <li key={index}>
            {group.map((item, i) => (
              <span key={i}>
                <LabelValue label={item.label} value={item.value} />
                {i < group.length - 1 && " ~ "}
              </span>
            ))}
          </li>
        ))}
      </ul>
      <br />
    </div>
  );
};
