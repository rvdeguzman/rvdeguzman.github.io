interface TagProps {
    text: string;
}

export default function Tag({ text }: TagProps) {
    return (
        <div className="border-2 rounded" style={{ borderColor: 'var(--line)' }}>
            <span className="px-2 py-1 text-xs rounded about" style={{ color: 'var(--property)' }}>
                {text}
            </span>

        </div>
    );
}
