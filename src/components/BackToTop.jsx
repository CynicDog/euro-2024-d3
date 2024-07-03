// import React, { useEffect, useState } from "react";
//
// const BackToTopButton = () => {
//     const [showTopBtn, setShowTopBtn] = useState(false);
//
//     useEffect(() => {
//         const handleScroll = () => {
//             if (window.scrollY > 200) {
//                 setShowTopBtn(true);
//             } else {
//                 setShowTopBtn(false);
//             }
//         };
//
//         window.addEventListener("scroll", handleScroll);
//
//         return () => {
//             window.removeEventListener("scroll", handleScroll);
//         };
//     }, []);
//
//     const scrollToTop = () => {
//         window.scrollTo({
//             top: 0,
//             behavior: "smooth",
//         });
//     };
//
//     return (
//         <>
//             {showTopBtn && (
//                 <div onClick={scrollToTop} className="btn badge bg-secondary-subtle text-secondary rounded-pill fw-lighter">
//                     back to top
//                 </div>
//             )}
//         </>
//     );
// };
//
// export default BackToTopButton;
