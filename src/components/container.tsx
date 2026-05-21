import React from "react"

interface ContainerProps extends React.ComponentProps<"div">{
        as?: keyof React.JSX.IntrinsicElements
    }

export default function Container({
    as = "div",
    children,
    className,
    ...props
}:ContainerProps){
    return React.createElement(
        as,
        {
            className: `max-w-3xl mx-auto ${className}`,
            ...props
        },
        children
    )
}