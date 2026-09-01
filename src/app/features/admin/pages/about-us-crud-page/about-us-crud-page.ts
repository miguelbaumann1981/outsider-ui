import { SubtitlePage } from '@/shared/components/subtitle-page/subtitle-page';
import { Component, signal } from '@angular/core';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor, Toolbar, toHTML } from 'ngx-editor';
import es from '@/i18n/es.json';
import { AboutUsApi } from '@/features/public/interfaces';
import {
  form,
  FormField,
  FormRoot,
  required,
  email,
  schema,
  maxLength,
  minLength,
} from '@angular/forms/signals';

@Component({
  selector: 'out-about-us-crud-page',
  imports: [SubtitlePage, NgxEditorComponent, NgxEditorMenuComponent, FormRoot, FormField],
  templateUrl: './about-us-crud-page.html',
  styles: `
    .editor {
      border: 2px solid rgba(0, 0, 0, 0.2);
      border-radius: 4px;

      .NgxEditor__MenuBar {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      }

      .NgxEditor {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border: none;
      }

      .CodeMirror {
        border: 1px solid #eee;
        height: auto;
        margin-bottom: 0.7rem;

        pre {
          white-space: pre !important;
        }
      }
    }
  `,
})
export class AboutUsCrudPage {
  protected readonly i18n = es;

  editor: Editor = new Editor();
  html: string = '';

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  aboutUsModel = signal<AboutUsApi>({
    id: '',
    mainText: '',
    collaborators: [],
  });
  aboutUsSchema = schema<AboutUsApi>((path) => {});

  readonly aboutUsForm = form(this.aboutUsModel, this.aboutUsSchema);

  onSubmit(event: Event) {
    event.preventDefault();
    const formData = this.aboutUsModel();
    // this.html = toHTML(this.aboutUsModel().mainText, this.editor.schema);
    console.log('Form Data:', formData);
  }
}
