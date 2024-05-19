import type { MDXComponents } from "mdx/types";

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => <h1 className="text-4xl font-bold mb-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mb-2">{children}</h3>,
    p: ({ children }) => <p className="text-base text-gray-700 dark:text-gray-300 mb-4">{children}</p>,
    code: ({ children }) => <code className="font-mono font-bold bg-gray-100 dark:bg-gray-800 p-1 rounded">{children}</code>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
    li: ({ children }) => <li className="mb-2">{children}</li>,
    div: ({ children }) => (
      <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {children}
      </div>
    ),
  };
}
