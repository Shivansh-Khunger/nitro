// Import necessary Module(s)
import { lightRed } from "kolorist";

// biome-ignore lint/suspicious/noExplicitAny: <errors can be of any type>
function handleError(err: any) {
    console.log(err);

    console.log(
        lightRed(
            "An Error has occured while setting up your project...\nWe recommend you to manually delete the project directory.",
        ),
    );

    process.exit(1);
}

export default handleError;
