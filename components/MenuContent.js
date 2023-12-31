import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {materialOceanic as style} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import nextConfig from 'next.config';
import rehypeRaw from "rehype-raw";

export default function MenuContent({content}) {
    return (
        <ReactMarkdown
            className='markdown-body'
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            transformImageUri={(path) => {
                return `${nextConfig.basePath || ''}${path}`;
            }}
            components={{
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            {...props}
                            style={style}
                            language={match[1]}
                            showLineNumbers
                            wrapLines={false}
                            lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code {...props} className={className}>
                            {children}
                        </code>
                    )
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
}