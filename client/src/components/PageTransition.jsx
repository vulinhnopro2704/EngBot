"use client"

import { motion } from "framer-motion"

const PageTransition = ({ children }) => {
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 },
        },
    }

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            {children}
        </motion.div>
    )
}

export default PageTransition

