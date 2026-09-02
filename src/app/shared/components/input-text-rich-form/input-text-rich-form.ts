import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'out-input-text-rich-form',
  imports: [NgxEditorComponent, NgxEditorMenuComponent, FormField],
  templateUrl: './input-text-rich-form.html',
  styleUrls: ['./input-text-rich-form.scss'],
})
export class InputTextRichForm {
  formField = input.required<FieldTree<string>>();

  editor: Editor = new Editor();

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
}
