interface TagProps {
    text: string;
}

export default function Tag({ text }: TagProps) {
    return (
        <span className="ps2-tag">
            {text}
        </span>
    );
}
