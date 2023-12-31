package com.practice.chatapp.controller;

import com.practice.chatapp.models.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

import java.security.Principal;

@Controller
@Slf4j
//@EnableWebSocket
public class ChatController {



    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    @SendToUser
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage, Principal user){

        log.info("User: "+user);
        return chatMessage;
    }


    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor simpMessageHeaderAccessor){
            simpMessageHeaderAccessor.getSessionAttributes().put("username", chatMessage.getSender());
            return chatMessage;
    }
}
