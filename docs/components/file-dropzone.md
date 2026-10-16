# FileDropzone

> A drag-and-drop area built on a native file input.

```tsx
import { FileDropzone } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `File dropzone` · Tokens: `file-dropzone.*` in [tokens.md](../tokens.md)

## When to use

- Uploading one or several files with a clear accepted format.

## When not to use

- Tiny uploads in dense forms where a plain file input is enough.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `accept` | `string` |  |  |
| `hint` | `string` |  |  |
| `onFiles` | `((files: FileList) => void)` |  |  |
| `Icon` | `Icon` |  |  |

## Accessibility

- It is a `<label>` around the native input: click, Enter and Space open the file picker, no drag required.
- Text such as "click to upload, or drag and drop" comes from `PanceProvider` labels.
- Report errors (type, size) in a `Field` error or `Alert`, not only visually.

## Content

- State accepted types and limits in `hint`: "PNG or CSV, up to 10 MB".

## Related

[`Field`](field.md) · [`Alert`](alert.md)

## Example

```tsx
<FileDropzone accept=".csv" hint="CSV up to 10 MB" onFiles={(files) => upload(files)} />
```
