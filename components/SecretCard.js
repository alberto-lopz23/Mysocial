import {
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  Text,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

const emojis = { like: "💙", love: "❤️", laugh: "😂", wow: "😮", sad: "😢" };

const SecretCard = React.memo(({ secret, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [reactions, setReactions] = useState(secret.reactions || []);
  const [showComments, setShowComments] = useState(false);

  // Lazy load de comentarios
  useEffect(() => {
    if (showComments && comments.length === 0) {
      getDoc(doc(db, "secrets", secret.id)).then((docSnap) => {
        if (docSnap.exists()) {
          setComments(docSnap.data().comments || []);
        }
      });
    }
  }, [showComments]);

  const countReactions = (type) =>
    reactions.filter((r) => r.type === type).length;

  const handleReaction = async (reactionType) => {
    const secretRef = doc(db, "secrets", secret.id);
    const userReaction = reactions.find((r) => r.userId === userId);

    let newReactions = [...reactions];
    if (userReaction && userReaction.type === reactionType) {
      // quitar reacción
      newReactions = newReactions.filter((r) => r.userId !== userId);
    } else {
      newReactions = newReactions.filter((r) => r.userId !== userId);
      newReactions.push({ userId, type: reactionType });
    }

    await updateDoc(secretRef, { reactions: newReactions });
    setReactions(newReactions);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const secretRef = doc(db, "secrets", secret.id);
    const commentObj = {
      id: Date.now().toString(),
      text: newComment,
      user: userId,
      createdAt: new Date(),
      replies: [],
    };
    await updateDoc(secretRef, { comments: arrayUnion(commentObj) });
    setComments((prev) => [...prev, commentObj]);
    setNewComment("");
  };

  const handleAddReply = async (commentId) => {
    if (!replyText[commentId]?.trim()) return;
    const secretRef = doc(db, "secrets", secret.id);
    const replyObj = {
      id: Date.now().toString(),
      text: replyText[commentId],
      user: userId,
      createdAt: new Date(),
    };
    const updatedComments = comments.map((c) =>
      c.id === commentId
        ? { ...c, replies: [...(c.replies || []), replyObj] }
        : c
    );
    await updateDoc(secretRef, { comments: updatedComments });
    setComments(updatedComments);
    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.dateText}>
        {secret.createdAt
          ? new Date(secret.createdAt.seconds * 1000).toLocaleString()
          : ""}
      </Text>
      <Text style={styles.secretText}>{secret.text}</Text>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
        {Object.keys(emojis).map((type) => (
          <TouchableOpacity key={type} onPress={() => handleReaction(type)}>
            <Text>
              {emojis[type]} {countReactions(type)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={{ marginTop: 10 }}
        onPress={() => setShowComments(!showComments)}
      >
        <Text>💬 {comments.length}</Text>
      </TouchableOpacity>

      {showComments && (
        <View style={styles.commentsSection}>
          {comments.map((c) => (
            <View key={c.id} style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 14 }}>
                {c.user}: {c.text}
              </Text>

              {c.replies &&
                c.replies.map((r) => (
                  <Text
                    key={r.id}
                    style={{ fontSize: 13, marginLeft: 15, color: "#555" }}
                  >
                    {r.user}: {r.text}
                  </Text>
                ))}

              <TouchableOpacity
                style={{ marginLeft: 10, marginTop: 3 }}
                onPress={() =>
                  setShowReplyInput((prev) => ({
                    ...prev,
                    [c.id]: !prev[c.id],
                  }))
                }
              >
                <Text style={{ color: "#007bff" }}>💬 Responder</Text>
              </TouchableOpacity>

              {showReplyInput[c.id] && (
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Escribe tu respuesta..."
                    value={replyText[c.id] || ""}
                    onChangeText={(text) =>
                      setReplyText((prev) => ({ ...prev, [c.id]: text }))
                    }
                  />
                  <TouchableOpacity
                    onPress={() => handleAddReply(c.id)}
                    style={{ marginLeft: 5 }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Enviar
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <TextInput
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Escribe un comentario..."
            />
            <TouchableOpacity
              onPress={handleAddComment}
              style={{ marginLeft: 5 }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#d4d3d3ff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  secretText: { fontSize: 16, marginBottom: 5 },
  dateText: {
    fontSize: 12,
    textAlign: "right",
    color: "#666",
    marginBottom: 8,
    backgroundColor: "#e2e1e1ff",
    padding: 4,
    borderRadius: 8,
    overflow: "hidden",
    width: "40%",
    alignSelf: "flex-end",
  },
  commentsSection: {
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 35,
  },
});

export default SecretCard;
