package com.cjw.service.learn;

import com.cjw.entity.learn.Note;

import java.util.List;

public interface NoteService {

    List<Note> getList(String id);
}
