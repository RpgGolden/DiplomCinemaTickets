import { useContext } from "react";
import DataContext from "../../context";

function HomePage() {
    const context = useContext(DataContext);
    console.log("context", context)
    return ( 
        <p>Page: {context.valueBasic}</p>
     );
}

export default HomePage;