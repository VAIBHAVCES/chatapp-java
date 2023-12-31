package com.practice.chatapp.configuration;


import com.practice.chatapp.models.ChatMessage;
import com.practice.chatapp.models.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {


    private final SimpMessageSendingOperations messageTemplate;
    @EventListener


    public void handleConectionOfUser(SessionConnectEvent sessionConnectEvent){

        Principal user = sessionConnectEvent.getUser();
        log.info("Session connected : "+user);
        return;
    }

    public void handleDisconnectionOfUser(SessionDisconnectEvent sessionDisconnectEvent){
        // TODO

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(sessionDisconnectEvent.getMessage());

        String user = (String) accessor.getSessionAttributes().get("username");
        if (user!=null){
            log.info("User disconnected: "+user);
            ChatMessage chatMessage = ChatMessage.builder()
                    .messageType(MessageType.LEAVER)
                    .sender(user)
                    .build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }

    }
}
