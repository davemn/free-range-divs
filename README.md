# Free Range Divs!

Have you ever wanted to build a web page that behaves like a desktop?
Think `<div>`s that behave like windows, with dragging and resizing that works the way you expect.

Or maybe you're building a workspace-style app, but need something less rigid than a Kanban board or tiling dashboard.

Or maybe you're making an avant-garde design for your personal website?

`free-range-divs` is for you.

![Screen Shot 2020-07-30 at 8 52 25 PM](https://user-images.githubusercontent.com/10509704/88991643-d5b47900-d2a6-11ea-9d51-3d09fffe533c.png)

# What's in the box?

Currently it's two React components:

- `<Desktop>` - Coordinates the child `<Window>`s. It's the sandbox for absolute positioning of the `<Window>`s.
- `<Window>` - A minimally-styled container that holds your component. **You decide** how your windows should look. `<Window>` takes care of movement, resizing, and layering.

# How do I install it?

```bash
> yarn add free-range-divs
```

# Can I see it in action?

Yep, [have fun!](https://musing-varahamihira-b4d852.netlify.app/)

# API

```js
<Desktop width={1024} height={768}>
  <Window>
    {({ isActive, titleProps }) => (
      <div className={`my-window ${isActive ? 'my-window--active' : ''}`}>
        <div className="my-window__title" {...titleProps}>
          notepad.exe - Hello World
        </div>
        <h1>Window contents.</h1>
      </div>
    )}
  </Window>
  <Window>
    {({ isActive, titleProps }) => (
      <div className={`my-window ${isActive ? 'my-window--active' : ''}`}>
        <div className="my-window__title" {...titleProps}>
          chrome.exe - Messageboard
        </div>
        <p>Leave a message...</p>
      </div>
    )}
  </Window>
</Desktop>
```

Each `<Window>` takes a render function, that receives:

- `isActive`: Is this window the one currently on top?
- `titleProps`: Spread this on whichever element represents the area that initiates a window drag. Traditionally this is the title bar, but you can pass it to *any* part of your component.

The render function should return *your component*. In the example above I show returning bare DOM elements with a couple of custom classNames. But those are just for demo!
