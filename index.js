const XLSX = require('xlsx');

function generateAllColorsAndShades() {
    const numBaseColors = 255; // Adjust this number as needed
    const numShades = 10; // Adjust this number as needed
    const allColors = new Set();

    for (let i = 0; i < numBaseColors; i++) {
        let baseColor;
        do {
            baseColor = generateRandomHexColor();
        } while (allColors.has(baseColor));

        allColors.add(baseColor);

        const shades = generateShades(baseColor, numShades);
        shades.forEach((shade, shadeIndex) => { 
            allColors.add({
                Index: i * numShades + shadeIndex + 1,
                rgb: shade.rgb,
                rgba: shade.rgba,
            });
        });
    }

    return Array.from(allColors);
}

function generateRandomHexColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${'0'.repeat(6 - randomColor.length)}${randomColor}`;
}

function generateShades(baseColor, numShades) {
    const baseRGB = hexToRGB(baseColor);
    const stepSize = 255 / (numShades - 1);

    return Array.from({ length: numShades }, (_, index) => {
        const shadeValue = Math.round(stepSize * index);
        return { rgb: `rgb(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b + shadeValue})`, rgba: `rgba(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b + shadeValue}, 0.8)` };
    });
}

function hexToRGB(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

function writeColorsToExcel(colors) {
    const workbook = XLSX.utils.book_new();
    const sheetData = colors.map(color => [color.Index, color.rgb, color.rgba]);

    const worksheet = XLSX.utils.aoa_to_sheet([['Index', 'rgb', 'rgba'], ...sheetData]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Colors');

    const excelFilePath = 'all_colors_and_shades.xlsx';
    XLSX.writeFile(workbook, excelFilePath);

    console.log(`Excel sheet with all colors and shades created: ${excelFilePath}`);
}

// Generate all colors and shades
const allColors = generateAllColorsAndShades();

// Write to Excel
writeColorsToExcel(allColors);
