import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

afterEach(() => cleanup());

describe("Rendering", () => {
    it("Should render all the elements correctly", () => {
        render(<App />);
        expect(screen.getByRole("heading")).toBeTruthy();
        expect(screen.getByTestId("copyright")).toBeTruthy();
        for(let i = 0; i < 6; i++){
            expect(screen.getAllByTestId("emotion-button")[i]).toBeTruthy();
        }
        expect(screen.getByTestId("icon-viewer")).toBeTruthy();
        expect(screen.getByTestId("icon-name")).toBeTruthy(); 
        expect(screen.getByTestId("color-icon")).toBeTruthy(); 
        expect(screen.getByTestId("color-background")).toBeTruthy(); 
        expect(screen.getByTestId("color-border")).toBeTruthy(); 
        expect(screen.getByTestId("icon-size")).toBeTruthy(); 
        expect(screen.getByTestId("download")).toBeTruthy();
        expect(screen.getByTestId("footer")).toBeTruthy();
    });
});

describe("Emotion button onClick event", () => {
    it("Should change current icon display", () => {
        render(<App />);
        let beforeClickIconName;
        let afterClickIconName;
        let editorIconName;
        for(let i = 0; i < 6; i++){
            beforeClickIconName = screen.getByTestId("icon-element").getAttribute("name");
            userEvent.click(screen.getAllByTestId("emotion-button")[i]);
            afterClickIconName = screen.getByTestId("icon-element").getAttribute("name");
            editorIconName = screen.getByTestId("icon-name").value;
            expect(afterClickIconName).not.toMatch(beforeClickIconName);
            expect(afterClickIconName).toMatch(editorIconName);
        }
    });
});

describe("Input form onChange event at icon name editor", () => {    
    it("Should set default icon correctly", () => {
        render(<App />);
        const textInputElement = screen.getByTestId("icon-name");
        expect(textInputElement.value).toBe("fas fa-question");
    });

    it("Should update input value correctly", () => {
        render(<App />);
        const textInputElement = screen.getByTestId("icon-name");
        userEvent.type(textInputElement, " test");
        expect(textInputElement.value).toBe("fas fa-question test");
    });
});

describe("Input form onChange event at color picker", () => {
    it("Should change icon color correctly", () => {
        render(<App />);
        const colorInputElement = screen.getByTestId("color-icon");
        fireEvent.input(colorInputElement, {target: {value: '#000000'}});
        const iconStyle = screen.getByTestId("icon-element").getAttribute("style");
        expect(iconStyle).toEqual(expect.stringContaining("color: rgb(0, 0, 0)"));
    });

    it("Should change background color correctly", () => {
        render(<App />);
        const colorInputElement = screen.getByTestId("color-background");
        fireEvent.input(colorInputElement, {target: {value: '#000000'}});
        const iconStyle = screen.getByTestId("icon-viewer").getAttribute("style");
        expect(iconStyle).toEqual(expect.stringContaining("background-color: rgb(0, 0, 0)"));
    });

    it("Should change border color correctly", () => {
        render(<App />);
        const colorInputElement = screen.getByTestId("color-border");
        fireEvent.input(colorInputElement, {target: {value: '#000000'}});
        const iconStyle = screen.getByTestId("icon-viewer").getAttribute("style");
        expect(iconStyle).toEqual(expect.stringContaining("border-color: #000000"));
    });
});

describe("Input form onChange event at size range bar", () => {
    it("Should set default size correctly", () => {
        render(<App />);
        const iconStyle = screen.getByTestId("icon-element").getAttribute("style");
        expect(iconStyle).toEqual(expect.stringContaining("font-size: 145%"));
    });

    it("Should change icon size correctly", () => {
        render(<App />);
        const sizeInputElement = screen.getByTestId("icon-size");
        fireEvent.input(sizeInputElement, {target: {value: 100}});
        const iconStyle = screen.getByTestId("icon-element").getAttribute("style");
        expect(iconStyle).toEqual(expect.stringContaining("font-size: 100%"));
    });
});