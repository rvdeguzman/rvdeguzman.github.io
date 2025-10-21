interface TagProps {
    text: string;
}

export default function Tag({ text }: TagProps) {
    return (
        <div className="border-2 rounded text-gray-800">
            <span className="px-2 py-1 text-xs dark:text-gray-200 rounded about">
                {text}
            </span>

        </div>
    );
}
