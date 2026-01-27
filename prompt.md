Overall task: Create website same as https://vishwamevakutumbak.wixsite.com/vishwameva-book

Download and Use the same images from this website https://vishwamevakutumbak.wixsite.com/vishwameva-book in the local project.

do not stretch the image in the header slider and place all the 8 images from the website https://vishwamevakutumbak.wixsite.com/vishwameva-book in the slider.

the slider dots should be superimposed on the bottom-center of the image itself, not below it.


My header is defaulting to white. Please update the CSS to force the background color using the specific color values from my theme.

Override Background: Apply background-color: rgba(var(--color_11), 1) !important; to the header.

Disable Overrides: Ensure that --screenwidth-corvid-background-color is not overriding this. You can do this by setting the header background directly rather than using the complex variable string.


Remove Transparency: Make sure there are no other properties like opacity: 0 or background: transparent affecting the header."