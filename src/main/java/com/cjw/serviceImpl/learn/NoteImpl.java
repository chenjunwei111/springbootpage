package com.cjw.serviceImpl.learn;

import com.cjw.dao.learn.NoteMapper;
import com.cjw.entity.learn.Note;
import com.cjw.service.learn.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("NoteImpl")
public class NoteImpl implements NoteService {


    @Autowired
    NoteMapper noteMapper;

    @Override
    public List<Note> getList(String id) {
        return noteMapper.getList(id);
    }
}
