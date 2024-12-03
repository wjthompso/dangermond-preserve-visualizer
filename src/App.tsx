import { ReactElement } from "react";
import BackgroundMapComponent from "./components/Map/BackgroundMapComponent";
import AllModels from "./components/Modals/AllModels";

function App(): ReactElement {
    return (
        <div className="p-20 border shadow-xl border-gray-50 rounded-xl">
            <header>
                <BackgroundMapComponent />
                <AllModels />
            </header>
        </div>
    );
}

export default App;
