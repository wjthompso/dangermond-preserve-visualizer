import { ReactElement } from "react";
import BackgroundMapComponent from "./components/Map/BackgroundMapComponent";
import AllModels from "./components/Modals/AllModels";

function App(): ReactElement {
    return (
        <div className="w-screen h-screen border shadow-xl border-gray-50 rounded-xl">
            <header className="w-full h-full">
                <BackgroundMapComponent />
                <AllModels />
            </header>
        </div>
    );
}

export default App;
