# Course Materials (intake folder)

Drop raw source material here and I'll turn it into finished mini-course content
on the actual site pages (`topics/*.html`). This folder is **not** committed to
git (see root `.gitignore`) — it's just a staging area on your machine, not part
of the published site.

## Folder names match the topic pages

Each folder here corresponds to one `topics/*.html` page:

| Folder            | Page                        | Mini-course topic     |
|--------------------|-----------------------------|------------------------|
| `addiction/`       | topics/addiction.html       | Addiction              |
| `adhd/`            | topics/adhd.html            | ADHD                   |
| `adjustment/`      | topics/adjustment.html      | Low Motivation         |
| `anxiety/`         | topics/anxiety.html         | Anxiety                |
| `breakup/`         | topics/breakup.html         | Relationships & Breakups |
| `depression/`      | topics/depression.html      | Depression             |
| `goal-setting/`    | topics/goal-setting.html    | Goal Setting           |
| `grief/`           | topics/grief.html           | Grief & Loss           |
| `injury-illness/`  | topics/injury-illness.html  | Burnout                |
| `job-loss/`        | topics/job-loss.html        | Getting Fired / Job Loss |
| `self-esteem/`     | topics/self-esteem.html     | Confidence             |
| `sexuality/`       | topics/sexuality.html       | Identity & Sexuality   |

## What to drop in each folder

Anything you've got: Word/Google docs, PDFs, slide decks (.pptx/.key/PDF export),
images, screenshots, video files, or a text file with links to hosted videos.

It doesn't need to be organized by module — just get the material for a topic
into its folder and tell me which topic(s) are ready. I'll read/watch it and:

- Write the module copy directly into the matching `topics/*.html` file, following
  the existing module structure (Intro Video, 4 content modules, "Want More
  Personalized Support?").
- Move any final images (thumbnails, diagrams) into `../images/` at whatever
  size the site needs.
- Handle video: raw video files are too large for a git repo, so if you drop one
  in, I'll flag it — it'll need to go up on YouTube (unlisted is fine, like the
  existing Weekly Videos) or another host, and then I embed the link the same
  way `videos.html` already does.

## Naming tip

If a file is meant for a specific module (e.g. module 3), prefix the filename
with the module number so intent is unambiguous, e.g. `03-cognitive-distortions.pdf`.
Not required, just makes things faster.
