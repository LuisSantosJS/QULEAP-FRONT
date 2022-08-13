import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
//@ts-ignore
import { toast } from "react-nextjs-toast";

interface MainProps {
  plan: string;
  planMax: number;
}

interface SongsProps {
  id: string;
  name: string;
}

export const Main: React.FC<MainProps> = (props: MainProps) => {
  const [index0, setIndex0] = useState(true);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<SongsProps[]>([]);
  const [mySongs, setMySongs] = useState<SongsProps[]>([]);

  const loadMusics = async () => {
    const response = await api.get("/song/all", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
    });
    if (response.status == 200) {
      setSongs(response.data);
    }
    setLoading(false);
  };

  const loadMusicsFavorite = async () => {
    const response = await api.get("/user/songs", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
    });
    if (response.status == 200) {
      setMySongs(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      loadMusics();
    }
  }, [typeof window]);

  useEffect(() => {
    if (typeof window !== undefined) {
      loadMusicsFavorite();
    }
  }, [typeof window]);

  const getImg = (songId: string) => {
    if (mySongs.find((e) => e.id == songId)) return "/love2.png";
    if (mySongs.length == props.planMax) return "/love0.png";
    return "/love1.png";
  };

  const addSong = async (songId: string) => {
    setMySongs([...mySongs, songs.filter(e=> e.id == songId)[0]])
    setLoading(true)
    const response = await api.put(
      "/user/songs/" + songId,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
      }
    );
    if (response.status !== 200) {
      let msm = "";
      for (const message of response?.data.message as string[]) {
        msm = msm + (msm.length == 0 ? "" : " | ") + message;
      }
      toast.notify(String(msm), {
        duration: 5,
        type: "error",
      });
    }
    loadMusicsFavorite();
  };

  const removeSong = async (songId: string) => {
    setMySongs([...mySongs.filter(e=> e.id !== songId)])
    setLoading(true)
    const response = await api.delete("/user/songs/" + songId, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
    });
    if (response.status !== 200) {
      let msm = "";
      for (const message of response?.data.message as string[]) {
        msm = msm + (msm.length == 0 ? "" : " | ") + message;
      }
      toast.notify(String(msm), {
        duration: 5,
        type: "error",
      });
    }
    loadMusicsFavorite();
  };

  const onButtonFavorite = (songId: string) => {
    if (mySongs.length == props.planMax && !mySongs.find((e) => e.id == songId))
      return;
    if (mySongs.find((e) => e.id == songId)) return removeSong(songId);
    return addSong(songId);
  };

  return (
    <div className="main-white-box">
      <div className="tabsRow">
        <div className="rowTab">
          <span className="taab" onClick={() => setIndex0(true)}>
            Lista de músicas
          </span>
          <span className="taab" onClick={() => setIndex0(false)}>
            Minha playlist
          </span>
        </div>
        <div
          style={{
            height: 1,
            justifyContent: "flex-start",
          }}
          className="rowTab"
        >
          <div
            style={{ marginLeft: index0 ? "0px" : "50%" }}
            className="target"
          />
        </div>
      </div>

      <div className="main-box">
        {index0 &&
          songs.map((res, i) => {
            return (
              <span className="row-table-songs" key={i}>
                <span>{res.name}</span>
                <img
                  onClick={() => onButtonFavorite(res.id)}
                  style={{
                    cursor:
                      mySongs.length == props.planMax &&
                      !mySongs.find((e) => e.id == res.id)
                        ? "default"
                        : "pointer",
                  }}
                  width={20}
                  height={20}
                  src={getImg(res.id)}
                />
              </span>
            );
          })}
        {!index0 &&
          mySongs.map((res, i) => {
            return (
              <span className="row-table-songs" key={i}>
                <span>{res.name}</span>
                <img
                  onClick={() => onButtonFavorite(res.id)}
                  style={{
                    cursor:
                      mySongs.length == props.planMax &&
                      !mySongs.find((e) => e.id == res.id)
                        ? "default"
                        : "pointer",
                  }}
                  width={20}
                  height={20}
                  src={getImg(res.id)}
                />
              </span>
            );
          })}
        {!index0 && mySongs.length == 0 && (
          <span
            style={{ justifyContent: "center" }}
            className="row-table-songs"
          >
            Sua playlist está vazia!
          </span>
        )}
      </div>

      <div
        style={{
          height: 60,
          paddingBottom: 12,
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
        }}
        className="rowTab"
      >
        <span>
          Você está utilizando o plano {props.plan}, neste plano você pode
          adicionar somente {props.planMax} músicas a sua playlist
        </span>
      </div>
      <div
        style={{ display: loading ? "flex" : "none" }}
        className={"loader"}
      />
    </div>
  );
};
