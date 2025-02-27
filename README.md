# Free Range `<Div>`s

Have you ever wanted to build a web page that behaves like a desktop?
Think `<div>`s that behave like windows, with dragging and resizing that works the way you expect.

Or maybe you're building a workspace-style app, but need something less rigid than a Kanban board or tiling dashboard.

Or maybe you're making an avant-garde design for your personal website?

`free-range-divs` is for you.

![Screen Shot 2020-07-30 at 8 52 25 PM](https://user-images.githubusercontent.com/10509704/88991643-d5b47900-d2a6-11ea-9d51-3d09fffe533c.png)

![An illustration of two layered windows. The nearest window is title "App Window". The background window is titled "Background Window".](/assets/promo.png?raw=true)

# What's in the box?

Currently it's two React components:

- `<Desktop>` - Coordinates the child `<FreeDiv>`s. It's the sandbox for absolute positioning of the `<FreeDiv>`s.
- `<FreeDiv>` - A minimally-styled container that holds your component. **You decide** how your content should look. `<FreeDiv>` takes care of movement and resizing.

# How do I install it?

```bash
> yarn add free-range-divs
```

# Can I see it in action?

Yep, [have fun!](https://musing-varahamihira-b4d852.netlify.app/)

# API

By example:

```js
<Desktop width={1024} height={768}>
  <FreeDiv key="app-notepad">
    {({ isActive, titleProps }) => (
      <div className={`my-window ${isActive ? 'my-window--active' : ''}`}>
        <div className="my-window__title" {...titleProps}>
          notepad.exe - Hello World
        </div>
        <h1>Window contents.</h1>
      </div>
    )}
  </FreeDiv>
  <FreeDiv key="app-chrome">
    {({ isActive, titleProps }) => (
      <div className={`my-window ${isActive ? 'my-window--active' : ''}`}>
        <div className="my-window__title" {...titleProps}>
          chrome.exe - Messageboard
        </div>
        <p>Leave a message...</p>
      </div>
    )}
  </FreeDiv>
</Desktop>
```

```css
.my-window {
  background-color: white;
  color: #888;
  border: 2px solid #ddd;
  height: calc(100% - 4px);
}
.my-window--active {
  color: black;
}
.my-window__title {
  background-color: #ddd;
  padding: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

Each `<FreeDiv>` takes a render function, that receives:

- `isActive`: Is this window the one currently on top?
- `titleProps`: Spread this on whichever element represents the area that initiates a window drag. Traditionally this is the title bar, but you can pass it to _any_ part of your component.

The render function should return _your component_. In the example above I show returning bare DOM elements with a couple of custom classNames. But those are just for demo!

## API - `<FreeDiv>` Only

Using the `<Desktop>` component is entirely optional! It provides tracking for which window among its children is "active". An active FreeDiv has a higher z-index than its siblings, and the `isActive` render prop is set to true.

If your app doesn't need to manage multiple `<FreeDiv>`s or if you're only interested in the drag/drop/resize functionality, `<FreeDiv>` can be used on its own. Note that the `isActive` prop passed to the render function never changes if there's no container `<Desktop>`!

## Deployment

For my own notes, but also for any future contributors.

Steps:

1. Merge all new features via PR. No PRs should modify the `dist/` directory.
2. (Admin only) `npm version [major|minor|patch]` on main branch.
3. (Admin only) Verify the contents of the new release's tarball, `npm pack --dry-run`.
4. (Admin only) `npm publish`
