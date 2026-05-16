'use client';

import CreateStaffPage from "@/app/staff/create/page";
import staff from "@/lib/apis/staff";
import {useEffect, useState} from "react";
import Staff from "@/lib/apis/staff";
import {StaffResponse} from "@/lib/apis/staff-types";
import {StaffApi} from "@/lib/apis";
import {useParams} from "next/dist/client/components/navigation";

export default function StaffDetailPage () {
  const [staff, setStaff] = useState<StaffResponse>();
  const params = useParams<{ id: string }>()

  const getStaff = async (id: number) => {
    try {
      const res = await StaffApi.getStaff(id)
      setStaff(res.data.data)
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    const fetch = async () => {
      if(params.id) {
        await getStaff(parseInt(params.id))
      }
    }
    fetch()
  }, [])

  return(
    <CreateStaffPage mode={'edit'} staff={staff} />
  )
}